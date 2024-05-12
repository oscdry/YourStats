# YourStats
### [Enlace web](https://yourstats.kxnzen.me)

## Instalación

Instalar las dependencias con el siguiente comando:

`npm i`

En caso de que multer no se instale correctamente, instalarlo de manera manual con el siguiente comando:

`npm i multer`

Generar el cliente de prisma con el siguiente comando:

`npx prisma generate`

Iniciar el servidor con el siguiente comando:

`npm run start`

Para compilación en desarrollo:

`npm run dev`

## Uso

En caso de que se encuentren errores externos, se deben generar API keys de brawl stars, debido a que requieren una IP estática, por eso recomendamos probar desde la web.


<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!-- FUTURES
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]-->





<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">YourStats</h3>

  <p align="center">
    project_subtitle
    <br />
    <!-- Link to Memory PDF -->
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <!-- Link to Demo Video -->
    <a href="https://github.com/github_username/repo_name">View Demo</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

[![Contributors][contributors-shield]][contributors-url]
[![MIT License][license-shield]][license-url]

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#deployment">Deployment</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://yourstats.kxnzen.me)

YourStats is a full-stack Web Application that allows users to track their progress in games such as Brawl Stars, LoL and Fortnite.

This repository contains the server-side of the project, this includes the API services, web server and it's interface.

This project was developed as a final project for the La Salle Gracia's Web Application Development course.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributors
[![Contributors][contributors-shield]][contributors-url]

Pol Condal - [GitHub](https://github.com/polcondal) - polcondalgarcia@gmail.com

Joan Linares - [GitHub](https://github.com/oscdry) - [joan.linares@gracia.lasalle.cat](joan.linares@gracia.lasalle.cat)

Oscar Sanz Sánchez - [GitHub](https://github.com/JoanLinares) - [oscar.sanz@gracia.lasalle.cat](oscar.sanz@gracia.lasalle.cat)


### Built With

* [![Express.js][Express.js]][Express-url]
* [![Node.js][Node.js]][Node-url]
* [![EJS][EJS.js]][EJS-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]

<!-- See: https://github.com/alexandresanlim/Badges4-README.md-Profile?tab=readme-ov-file#-terminal -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

In order to get a local copy up and running, follow these steps.

**Make sure you have installed all the prerequisites and dependencies, see [Prerequisites](#prerequisites) and [Installation](#installation).**

### Prerequisites

Requirements for the software and other tools to build, test and push
- [Node.js (v20 and higher recommended)](https://nodejs.org/en)
- Access and permissions to write & read to a Firebase Database
- Access and permissions to write & read to a MySQL Database

### Installation

3. Clone the repo
   ```sh
   git clone https://github.com/LaSalleGracia-Projectes/projecte-aplicaci-web-servidor-steve-wozniak.git
   ```
4. Install NPM packages
   ```sh
   npm i
   ```
### Required Environment Variables
- `JWT_SECRET` - JWT Secret for the application.
- `DATABASE_URL` - MySQL Database URL.

`(mysql://db_user:db_password@db_host:db_port/db_name)`

- The `keyFilename` property inside `firebaseConnections.ts` - Firebase Key Filename for the Firebase project you are using.

### Optional Environment Variables
*Warning: These environment variables are required for some functionalities of the application to work properly, if not set, parts of the application will not work as expected. That said, the application should still start and run without these environment variables.*

- `EMAIL_HOST` - Email Host for sending emails.
- `EMAIL_USERNAME` - Email Port for sending emails.
- `EMAIL_PASSWORD` - App Password for sending emails.
- `FIREBASE_OAUTH_API_KEY` - Firebase OAuth API Key (For Authentication with Google).
- `FORTNITE_API_KEY` - Fortnite API Key.
- `BRAWL_STARS_API_KEY` - Brawl Stars API Key.
- `RIOT_API_KEY` - Riot API Key.

### Deployment
1. Build the Prisma Client
   ```sh
   npx prisma generate
   ```
2. Build the project
   ```sh
   npm run build
   ```
3. Serve the project
   ```sh
   npm run start
   ```
   If the server is unable to start due to ports requiring admin permissions, run the server with sudo:
   ```sh
    sudo npm run start
    ```

#### HTTPS
To enable HTTPS, you must have a valid SSL certificate and key.

Once you have them, create a `/certs` folder in the root of the project and place the certificate and key files inside it.

The certificate file should be named `cert.pem` and the key file should be named `key.pem`.


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Simply navigate to your started server and start tracking your progress in your favorite games!

The official website is hosted at [https://yourstats.kxnzen.me](https://yourstats.kxnzen.me)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

As a future plan, we would like to maintain the project and fix any issues that may arise in the future.

Since this project relies on external APIs, we would like to implement a caching system to reduce the number of requests made to the APIs.

<!-- See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues). -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- LICENSE -->
## License

[![MIT License][license-shield]][license-url]

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to.
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [Font Awesome](https://fontawesome.com)
* [ExpressJS](https://expressjs.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/LaSalleGracia-Projectes/projecte-aplicaci-web-servidor-steve-wozniak.svg?style=for-the-badge
[contributors-url]: https://github.com/LaSalleGracia-Projectes/projecte-aplicaci-web-servidor-steve-wozniak/graphs/contributors
[license-shield]: https://img.shields.io/github/license/LaSalleGracia-Projectes/projecte-aplicaci-web-servidor-steve-wozniak.svg?style=for-the-badge
[license-url]: https://github.com/LaSalleGracia-Projectes/projecte-aplicaci-web-servidor-steve-wozniak/blob/master/LICENSE.txt
[product-screenshot]: /readme/images/yourstats-web.png

[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[EJS.js]: https://img.shields.io/badge/EJS-20232A?style=for-the-badge&logo=ejs&logoColor=61DAFB
[EJS-url]: https://ejs.co/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/