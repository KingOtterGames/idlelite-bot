# Discord Bot Template
This template was built to make it easier for developers to bootstrap a discord bot together, quickly and effeciently. It sets the foundation for building a scalable and more maintable discordjs bot.

## Motivation
The reason for this bot was to remove the overhead of setting up the foundation and standards for every bot I created. This was repetitive and took time to do. So, I wanted a template with this all set up and ready to go, so I can get right into development. If one person is having this issue, odds are someone else is, so I wanted to make this an open-source project.

## Installation
In order to easily start using this template, hit "Use this template" from with the GitHub repository

![image](https://user-images.githubusercontent.com/34040658/170808950-9c9165f7-a3ab-4915-8177-c39cf12d2bb5.png)

This will let you generate a copy of the project into a new repository within your own organization or personal profile.

Next, clone the project down using:

```
git clone <REPO LINK>
```

Once installed locally, you will need to install the npm dependencies with:

```
npm i
```

Create a .env file in the root of the project with the following:

```
DISCORD_TOKEN=<YOUR TOKEN HERE>
```

This will be used for logging in. You will have to go to Discords developer portal in order to setup the bot and get a access token.

To start it up, run 

```
npm start
```

## Docker Command
Build Image
```
docker build . -t discordbot
```

Run Image
```
docker run -d -it -e DISCORD_TOKEN='' discordbot
```

Pull in the Example Container (for testing docker really). 
```
docker pull pessman/discord_bot
```

## Dynamic Folders
For this template, I decided to do some magic and use recursion to find commands, button actions, and events. Follow the examples in each of the folders to get a grasp of how this works. Within the commands folder for example, you can organize your commands into folders, making it easy to manage. Using recursion, we find all the nested commands. 

## Support
For support on this template or any other template in this organization, check out our community discord: https://discord.gg/wezq9R5Xtc

