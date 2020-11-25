import Discord from 'discord.js';
import { IGuildSettings } from '../settings';
import { Command, categories } from '../commands';
import { commands } from '../bot';

const gh_issues = 'https://github.com/KitCat-Bot/KitCat/issues';
const footer = 'Command format: `[]` = Optional, `{}` = Required, `|` = Or';

export default class Help extends Command {
    executor = 'help';
    category = 'kitcat';
    display_name = 'Help';
    description = `What you're looking at right now.`;
    usage = '[category]';
    guildOnly = false;
    unlisted = false;
    nsfw = false;

    run(message: Discord.Message, args: string[], settings: IGuildSettings): any {
        const prefix = settings ? settings.prefix : 'k!';
        if (args.length === 0) {
            const embed = new Discord.MessageEmbed().setColor(0xf9f5ea).setTitle('Categories');
            categories.forEach((category) => {
                let desc = category.description !== '' ? category.description + '\n' : '';
                desc += `\`${prefix}help ${category.name}\``;

                embed.addField(category.display_name, desc);
            });
            embed.addField('Bugs', `See an issue? Report it [here](${gh_issues}).\n${footer}`);
            message.channel.send(embed);
        } else if (!categories.some((c) => c.name === args[0]) && !commands.some((c) => c.executor === args[0]))
            message.channel.send(`No commands or categories under that name exist!`);
        else {
            const target = categories.find((c) => c.name === args[0]) || commands.find((c) => c.executor === args[0]);

            const embed = new Discord.MessageEmbed().setColor(0xf9f5ea);

            if (target instanceof Command) {
                embed.setTitle(target.display_name);
                embed.addField(target.description !== '' ? target.description : '\u200B', target.getUsage(settings));
            } else {
                embed.setTitle(target.display_name);
                commands
                    .filter((c) => c.category === target.name && !c.unlisted)
                    .forEach((c) => {
                        const commandHelp = c.getCommandHelp(settings);
                        embed.addField(commandHelp[0], commandHelp[1]);
                    });
            }

            embed.addField('Bugs', `See an issue? Report it [here](${gh_issues}).\n${footer}`);
            message.channel.send(embed);
        }
    }
}
