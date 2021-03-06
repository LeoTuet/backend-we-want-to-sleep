[contributors-shield]: https://img.shields.io/github/contributors/LeoTuet/backend-we-want-to-sleep.svg?style=for-the-badge
[contributors-url]: https://github.com/LeoTuet/backend-we-want-to-sleep/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/LeoTuet/backend-we-want-to-sleep.svg?style=for-the-badge
[forks-url]: https://github.com/LeoTuet/backend-we-want-to-sleep/network/members
[stars-shield]: https://img.shields.io/github/stars/LeoTuet/backend-we-want-to-sleep.svg?style=for-the-badge
[stars-url]: https://github.com/LeoTuet/backend-we-want-to-sleep/stargazers
[issues-shield]: https://img.shields.io/github/issues/LeoTuet/backend-we-want-to-sleep.svg?style=for-the-badge
[issues-url]: https://github.com/LeoTuet/backend-we-want-to-sleep/issues
[license-shield]: https://img.shields.io/github/license/LeoTuet/backend-we-want-to-sleep.svg?style=for-the-badge
[license-url]: https://github.com/LeoTuet/backend-we-want-to-sleep/blob/master/LICENSE

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

# We want to sleep

A school project to let students vote for a new start time.

Frontend for [wewanttosleep.de](https://wewanttosleep.de/)

## Built with

- [Node.js](https://github.com/nodejs)
- [TypeScript](https://github.com/microsoft/TypeScript)
- [MongoDB](https://www.mongodb.com/)

## Contribute

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

To contribute:

1. Fork the project
2. Create a branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Added a new feature'`)
4. Push your changes (`git push origin feature/new-feature`)
5. Create a [pull request](https://github.com/LeoTuet/backend-we-want-to-sleep/pulls)

## Development

### Available Scripts

In the project directory, you can run:

#### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://docs.npmjs.com/cli/v7/commands/npm-test) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://docs.npmjs.com/cli/v6/commands/npm-build) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can???t go back!**

If you aren???t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you???re on your own.

You don???t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn???t feel obligated to use this feature. However we understand that this tool wouldn???t be useful if you couldn???t customize it when you are ready for it.

### MongoDB

In order for this project to run you need a running instance of a MongoDB

### Enviornment Variables

There is a list of environment variables which need to be set a list of them can be found [here](https://github.com/LeoTuet/deployment-we-want-to-sleep).

The variables can be set in a .env file as key-value pairs (please note that you may need to adjust the path to the .env file [here](https://github.com/LeoTuet/backend-we-want-to-sleep/blob/main/src/utils/secrets.ts#L6))

## License

Distributed under the MIT License. See `LICENSE` for more information.
