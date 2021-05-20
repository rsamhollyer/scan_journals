# Journal Scanner

This app attempts to alleviate the mundanity of manually checking up on cohort students' journal entries. It uses a variety of different packages to do so, many of which are not active in this current rendition of the app, but are included if another user chooses to employ them.

## Prerequisites

`node.js`

---

## Installation

Clone down the repository to your own remote directory of choice.

```bash
git@github.com:rsamhollyer/scan_journals.git
```

Get all dependencies installed.

```bash
npm i
```

Your `package.json` has an included script to run the development app with `nodemon`

```bash
"dev": "nodemon index.js --ignore db.json"
```

---

## SlackBots & Heroku

I used the guide from [Karen Ying's blog post](https://blog.karenying.com/posts/annoy-or-impress-your-coworkers-with-a-slack-bot-from-scratch) to setup my Slackbot and Heroku site. Feel free to deviate, but at your own risk.

### Linting

The installation includes a standard `eslint` configuration that you are welcome to change to fit your needs, other wise it should work out of the box, depending on if you've turned off an automatic formatting extension.

---

### Running the App

To start the app, just type:

```bash
node index.js
```

This app uses a mix of `cheerio, node-cron, and slackbots` to automatically scrape and emit a message to your intended user on Slack.
Currently, I have elected to run the app under the free model using [Heroku](https://www.heroku.com) and Heroku's automated scheduler program. I've set it up to run at a certain time everyday and purposefully used a `process.exit()` in the `cron schedule` to kill the process on Heroku's end. This way the app remains inactive and Heroku shuts down the service.
Feel free to use a more permanent solution with lambda functions or an AWS server etc.

You'll need to update the `student_repos/data.js` file to fit your needs.
If you need to make changes to the app after it is already running, you'll probably need to delete your `db.json` and update your `db.js` file to account for any changes to your `expectedEntries` value before pushing your git changes and deploying your app in Heroku.

#### Minutiae

You may notice that I've included `express, morgan, and winston` in case you want to convert this to a server api to send the scrape to a route as JSON.
