export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  image?: string;
  localImage?: string;
  description: string;
  bullets: string[];
  linkUrl: string;
  linkType: "site" | "repo";
  order: number;
}

export interface About {
  _id: string;
  bio: string;
  education: string;
  skills: { name: string; badgeUrl: string }[];
  certifications: string[];
  passion: string;
  extracurriculars: string;
  mediumUrl: string;
  likes: string;
  dislikes: string;
}

export interface SiteSettings {
  _id: string;
  name: string;
  tagline: string;
  portrait?: string;
  localPortrait?: string;
  location: string;
  socialLinks: { platform: string; url: string }[];
  copyright: string;
}

export const fallbackProjects: Project[] = [
  {
    _id: "project-1",
    title: "Job Basket",
    slug: { current: "job-basket" },
    localImage: "/images/jobbasket.png",
    description:
      "Job Basket is a single-page web application that allows a user to keep track of job listings that interest them, and also add notes and reminders to stay organized.",
    bullets: [
      "Job Basket is a single-page web application that allows a user to keep track of job listings that interest them, and also add notes and reminders to stay organized.",
      "The application incorporates a self-built Rails API as a backend to persist data with PostgresQL. Heavy focus on React.js for frontend and Semantic UI for styling.",
      "Adobe XD to generate wireframes to help visualize the user journey and organize components.",
      "Authorization and authentication is accomplished by using JSON Web Tokens and localStorage to store encrypted user information client-side.",
    ],
    linkUrl: "https://jobbasket-app.herokuapp.com/",
    linkType: "site",
    order: 1,
  },
  {
    _id: "project-2",
    title: "SolelyPets",
    slug: { current: "solelypets" },
    localImage: "/images/solelypets.png",
    description:
      "SolelyPets draws inspiration from Kickstarter and OnlyFans as a platform for animal shelters to accept donations.",
    bullets: [
      "SolelyPets draws inspiration from Kickstarter and OnlyFans as a platform for animal shelters to accept donations.",
      "The project started with Adobe XD for wireframes, and lucidchart for ERD(entity relational database) design.",
      "Rails API as a backend, and taking advantages of gems like Bcrypt, JWT, and active_model_serializers(customization and rendering of data in JSON format). Cloudinary API to host photos and Stripe API to handle donations securely.",
      "Frontend utilizes Javascript libraries such as React.js, react-router-dom, and Redux.js(state management through global store). Styling accomplished by Semantic UI.",
    ],
    linkUrl: "https://github.com/wilsonvetdev/solelypets-frontend",
    linkType: "repo",
    order: 2,
  },
  {
    _id: "project-3",
    title: "A Little Bid",
    slug: { current: "a-little-bid" },
    localImage: "/images/alittlebid.png",
    description:
      "A Little Bid is a vanilla JS single page application intended to allow a user to post job information and solicit contractor bids for home constructions.",
    bullets: [
      "A Little Bid is a vanilla JS single page application intended to allow a user to post job information and solicit contractor bids for home constructions.",
      "Utilized working knowledge of designing an entity relational database and Active Record Associations when creating the Rails API for the backend.",
      "Main focus on vanilla JS for interactions between user and application.",
      "Practice use of Fetch API to interact with the self-built backend.",
    ],
    linkUrl: "https://github.com/wilsonvetdev/a-little-bid-frontend",
    linkType: "repo",
    order: 3,
  },
  {
    _id: "project-4",
    title: "Wynhangry",
    slug: { current: "wynhangry" },
    localImage: "/images/hangry.png",
    description:
      "Hangry is a front-end only web application that allows a user to find restaurants nearby.",
    bullets: [
      "Hangry is a front-end only web application that allows a user to find restaurants nearby.",
      "The user is able to filter based on cuisine and dollar signs.",
      "We utilized the Yelp Fusion API, Fetch API, fun gifs, custom CSS, and React.js on this project.",
    ],
    linkUrl: "https://wyn-hangry.herokuapp.com/",
    linkType: "site",
    order: 4,
  },
  {
    _id: "project-5",
    title: "Word of Mouth",
    slug: { current: "word-of-mouth" },
    localImage: "/images/wordofmouth.png",
    description:
      "Word Of Mouth is an app for students to read and/or write reviews about their professors.",
    bullets: [
      "Word Of Mouth is an app for students to read and/or write reviews about their professors. The application also allows a user to add a professor to a college of their choice. Search functionalities of colleges and professors are also included.",
      "This is strictly a Ruby on Rails project and includes authorization and authentication through sessions.",
      "The application required competency with the MVC layers, ERD design, and active record to create associations.",
    ],
    linkUrl: "https://github.com/wilsonvetdev/word-of-mouth",
    linkType: "repo",
    order: 5,
  },
  {
    _id: "project-6",
    title: "Wynwaldo",
    slug: { current: "wynwaldo" },
    localImage: "/images/wynwaldo.png",
    description:
      "Wynwaldo allows a user to browse various wall-arts in the Wynwood area. The user is also able to upload their own images to the application.",
    bullets: [
      "Wynwaldo allows a user to browse various wall-arts in the Wynwood area. The user is also able to upload their own images to the application.",
      "The application utilizes a React frontend and a Rails backend.",
      "Amazon AWS for the storage of art images.",
      "Mapbox API for rendering of the app and showing the locations of the art pieces in Wynwood.",
    ],
    linkUrl: "https://wynwaldo.herokuapp.com/",
    linkType: "site",
    order: 6,
  },
];

export const fallbackAbout: About = {
  _id: "about-1",
  bio: "Wilson is a Military Veteran leveraging over 5 years of proven experience in project management, leadership, team development, and actively acquiring new skills in software engineering and web development. Managed teams of over 15 personnel in a technical and operational environment. Possess a comprehensive background in technical writing, leadership, risk management, coding, training, quality assurance, and innovation. Created complex, functional web applications from scratch to building out databases with Ruby on Rails and integrated front-end Javascript libraries such as React.js/Redux.js.",
  education:
    "Senior in Information Systems with focus on technology and management, enrolled in CUNY School Of Professional Studies",
  skills: [
    {
      name: "HTML",
      badgeUrl:
        "https://img.shields.io/badge/html-%23239120.svg?&style=for-the-badge&logo=html5&logoColor=white",
    },
    {
      name: "CSS",
      badgeUrl:
        "https://img.shields.io/badge/css-%23239120.svg?&style=for-the-badge&logo=css3&logoColor=white",
    },
    {
      name: "JavaScript",
      badgeUrl:
        "https://img.shields.io/badge/javascript-%23F7DF1E.svg?&style=for-the-badge&logo=javascript&logoColor=black",
    },
    {
      name: "React",
      badgeUrl:
        "https://img.shields.io/badge/react%20-%2320232a.svg?&style=for-the-badge&logo=react&logoColor=%2361DAFB",
    },
    {
      name: "Redux",
      badgeUrl:
        "https://img.shields.io/badge/redux%20-%23593d88.svg?&style=for-the-badge&logo=redux&logoColor=white",
    },
    {
      name: "TypeScript",
      badgeUrl:
        "https://img.shields.io/badge/typescript%20-%23007ACC.svg?&style=for-the-badge&logo=typescript&logoColor=white",
    },
    {
      name: "Ruby",
      badgeUrl:
        "https://img.shields.io/badge/ruby-%23CC342D.svg?&style=for-the-badge&logo=ruby&logoColor=white",
    },
    {
      name: "Rails",
      badgeUrl:
        "https://img.shields.io/badge/rails%20-%23CC0000.svg?&style=for-the-badge&logo=ruby-on-rails&logoColor=white",
    },
    {
      name: "Python",
      badgeUrl:
        "https://img.shields.io/badge/python%20-%2314354C.svg?&style=for-the-badge&logo=python&logoColor=white",
    },
    {
      name: "Postgres",
      badgeUrl:
        "https://img.shields.io/badge/postgres-%23316192.svg?&style=for-the-badge&logo=postgresql&logoColor=white",
    },
    {
      name: "MySQL",
      badgeUrl:
        "https://img.shields.io/badge/mysql-%2300f.svg?&style=for-the-badge&logo=mysql&logoColor=white",
    },
  ],
  certifications: [
    "Full-Stack Web Developer (Wyncode Academy)",
    "Software Engineering (The Flatiron School)",
    "Google IT Support Professional Certificate",
    "Certified Associate in Project Management",
    "Certified Scrum Product Owner",
  ],
  passion: "Leaving the world better than how we found it",
  extracurriculars: "Member of the U.S Navy Reserves",
  mediumUrl: "https://medium.com/@wilsonvetdev",
  likes: "Tequila, Video Games, Movies, Fitness, Travel, Anime",
  dislikes: "Long Lines, Missing Socks, Winter",
};

export const fallbackSiteSettings: SiteSettings = {
  _id: "settings-1",
  name: "Wilson Ng",
  tagline: "Web Developer - Navy Vet - Deep Interest In Project Management",
  localPortrait: "/images/portrait.png",
  location: "New York City, New York",
  socialLinks: [
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/in/wilsonvetdev/",
    },
    { platform: "medium", url: "https://medium.com/@wilsonvetdev" },
    { platform: "github", url: "https://github.com/wilsonvetdev" },
  ],
  copyright: "Wilson The Vet Dev",
};
