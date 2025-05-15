# Sigma WebDev Course V84 - Music Player

## 🚀 Overview

This is a simple web-based music player built with HTML, CSS, and JavaScript. It dynamically loads playlists and songs from the `songs/` directory and displays album cards with metadata.

## 📁 Project Structure

```
v84/
├── css/              # Stylesheets
├── img/              # Icons and images
├── js/               # JavaScript logic
├── favicon.ico
├── index.html
├── songs/            # Playlists & songs (tracked empty – add your own)
│   └── .gitkeep      # Empty file to keep this folder in Git
└── .gitignore
```

## ⚙️ Setup & Running Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   ```

2. **Serve via a local web server** (directory listings are required)

   * **VS Code Live Server** extension
   * **Python HTTP server**:

     ```bash
     python -m http.server 8000
     ```
   * **Node `http-server`**:

     ```bash
     npm install --global http-server
     http-server -c-1
     ```

3. **Open the app** in your browser:

   ```
   ```

[http://localhost:8000](http://localhost:8000)

```

## 🎵 Adding Your Own Songs
The `songs/` folder is intentionally empty (contents are Git‑ignored) so you can add your own media. To create a new playlist or album:

1. **Create a subfolder** under `songs/`:
```

songs/
└── my-album/
├── track1.mp3
├── track2.mp3
├── cover.jpg        # Album cover image
└── info.json        # Album metadata

````

2. **Add your `.mp3` files** inside that subfolder.

3. **Add an album cover** named `cover.jpg` (optional but recommended).

4. **Create an `info.json`** with the following format:
```json
{
  "title": "My Album Title",
  "description": "A short description of this album or playlist."
}
````

* `title`: Displayed under the cover image
* `description`: Displayed below the title

5. **Refresh the page**. Your new playlist will appear as a card. Clicking it loads and plays the first track.

## 🔒 `.gitignore` & `.gitkeep`

* The `.gitignore` file contains:

  ```gitignore
  songs/*
  !songs/.gitkeep
  ```

  * `songs/*` ignores all files in the `songs/` folder
  * `!songs/.gitkeep` keeps the empty folder structure in Git

* The `.gitkeep` file is an empty placeholder to ensure Git tracks the `songs/` directory itself.

## 📝 Contributing

Feel free to open issues or pull requests! If you add new features or fix bugs, please update this README accordingly.

---

<p align="center">Made with ❤️ for Sigma WebDev Course V84</p>
