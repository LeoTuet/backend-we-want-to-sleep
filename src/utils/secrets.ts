import fs from "fs";
import path from "path";

// Default secrets directory.
export const DOCKER_SECRET_DIR = "/run/secrets";
export const LOCAL_SECRET_FILE = ".env";

export interface Secrets {
  [key: string]: string;
}

export type GetSecretFn<S extends Secrets = Secrets> = (
  name: keyof S
) => S[keyof S];

export function getDockerSecrets<T extends Secrets = Secrets>(
  secretDir?: string
): T {
  const _secretDir = secretDir || DOCKER_SECRET_DIR;

  const secrets: Secrets = {};
  if (fs.existsSync(_secretDir)) {
    const files = fs.readdirSync(_secretDir);

    files.forEach((file) => {
      const fullPath = path.join(_secretDir, file);
      const key = file;
      if (fs.lstatSync(fullPath).isDirectory()) return;
      secrets[key] = fs.readFileSync(fullPath, "utf8").toString().trim();
    });
  }
  return secrets as T;
}

export function getSecretFactory<S extends Secrets = Secrets>(
  secrets: S
): GetSecretFn<S> {
  return (name: keyof S) => secrets[name];
}

export function getLocalSecrets(filepath: string) {
  const content = fs.readFileSync(filepath, "utf8");
  return content
    .trim()
    .split(/\r?\n/u)
    .reduce((result: { [key: string]: string }, elem: string) => {
      const line = elem.trim();
      if (!line || line.startsWith("#")) {
        return result;
      }
      const splitIndex = line.indexOf("=");
      const key = line.substring(0, splitIndex);
      const val = line.substring(splitIndex + 1);
      if (!key) {
        throw new Error(`Missing key for environment variable in ${filepath}`);
      }
      result[key] =
        val.startsWith("'") && val.endsWith("'") ? val.slice(1, -1) : val;
      return result;
    }, {});
}

function getSecrets(dockerSecretDir: string, localSecretFile: string) {
  const dockerSecrets = getDockerSecrets(DOCKER_SECRET_DIR);
  if (Object.keys(dockerSecrets).length) {
    return dockerSecrets;
  } else {
    return getLocalSecrets(localSecretFile);
  }
}

// Provide defaults.
export const secrets = getSecrets(DOCKER_SECRET_DIR, LOCAL_SECRET_FILE);
export const getSecret: GetSecretFn = getSecretFactory(secrets);
