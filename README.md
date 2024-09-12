# EZScript

**EZScript** is a real-time collaborative code editor built using the MERN stack (MongoDB, Express, React, Node.js) and integrated with Socket.io for live collaboration. The platform allows multiple users to edit and run code simultaneously, supporting JavaScript only for now, via the Piston API.

## Demo of the Application

https://github.com/user-attachments/assets/b96d0f11-3d08-4c42-ad19-52a0716fb1f5

## Features

- **Real-time collaboration**: Multiple users can collaborate on the same code in real-time.
- **Multiple programming languages**: Supports a wide range of languages (via the Piston API).
- **Code execution**: Users can write and execute code directly in the editor.
- **Role-based access**: Users can be designated as either `editors` (able to write) or `viewers` (read-only mode).
- **Live code execution output**: See the output of code execution instantly.

## Technology Stack

- **Frontend**: React, Socket.io, Monaco Editor, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Code Execution**: Piston API for running code in JavaScript.
- **Real-time Communication**: Socket.io for real-time collaboration

## Usage

- **Editor Role**: Users assigned the editor role can write and run code in the editor.
- **Viewer Role**: Users assigned the viewer role can only view the editor content without making any changes.
- **Run Code**: Click the "Run" button to execute the code and see the output in the results section.
- **Real-time Collaboration**: Multiple users can join a session and collaborate on the same code, with changes reflected in real-time.

## Roadmap

- [ ] Add support for more programming languages.
- [ ] Implement real-time syntax error checking.
- [ ] Create user authentication with role management.
- [ ] Improve UI and add more editor customization options.

## Contributing

Feel free to submit a pull request if you'd like to contribute to the project. Please ensure that your changes align with the overall design and functionality of the platform.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Special thanks to [Piston](https://github.com/engineer-man/piston) for providing the API for running code in multiple languages.
