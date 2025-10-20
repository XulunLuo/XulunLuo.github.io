// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-filmmaking",
          title: "filmmaking",
          description: "Film projects, commersials, music videos, short films, and other creative works.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/filmmaking/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A showcase of my work across software engineering, VR/XR development, and interactive media",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "Xulun Luo — Software Engineer &amp; Creative Technologist.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "projects-gasoline-transportation-ally-top-down-survival-refueling-game",
          title: 'Gasoline Transportation Ally — Top-Down Survival Refueling Game',
          description: "A fast-paced top-down survival game where players refuel escaping cars using a custom pressure-sensor controller to keep them from running out of gas and getting caught.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/gasoline/";
            },},{id: "projects-tartan-dynamic-3d-reconstruction-benchmark-in-dynamic-scenes",
          title: 'Tartan-Dynamic — 3D Reconstruction Benchmark in Dynamic Scenes',
          description: "Benchmark pipeline generating dynamic-scene datasets with true novel-view splits, synchronized simulation and planning stack, and reproducible RGB/Depth/LiDAR/pose capture.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/tartan-dynamic/";
            },},{id: "projects-uwb-imu-fusion-camera-tracking",
          title: 'UWB + IMU Fusion Camera Tracking',
          description: "Radio + inertial fallback tracking for LED-wall sets, time-locked to LTC for frame-true capture at 25 Hz.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/uwb-imu/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%78%75%6C%75%6E%6C@%61%6E%64%72%65%77.%63%6D%75.%65%64%75", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/XulunLuo", "_blank");
        },
      },{
        id: 'social-instagram',
        title: 'Instagram',
        section: 'Socials',
        handler: () => {
          window.open("https://instagram.com/fieldluo_fl", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/xulun-luo", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
