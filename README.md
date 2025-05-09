# NPS Static Front

This is the repository for the static front-end of the NPS (Net Promoter Score) project. It contains the necessary files for the user interface.

## Project Structure

- **HTML**: Markup files for the interface.
- **CSS**: Styles for the application's design.
- **JavaScript**: Scripts for interactive functionalities.

## Prerequisites

- A modern browser to view the front-end.
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) to deploy the project.

## How to Use

1. Clone the repository:

```bash
git clone https://github.com/JardessoMonster/nps-static-front.git
```

2. Navigate to the project directory:

```bash
cd nps-static-front
```

3. Open the `index.html` file in your browser.

## Deploy

To deploy the project to Google Cloud Storage, run the following command:

```bash
gsutil -m cp -r * gs://{BUCKET_NAME}
```
