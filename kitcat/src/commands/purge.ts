import Discord, { TextChannel } from 'discord.js';
import { Command } from '../commands';
import { NOOP, userBypass } from '../util/utils';

export default class Purge extends Command {
    executor = 'purge';
    category = 'moderation';
    display_name = '🗑️ Purge';
    description = `Used to delete messages in bulk.`;
    usage = '{amount: default = 5}';
    guildOnly = true;
    unlisted = false;
    nsfw = false;

    run(message: Discord.Message, args: string[]): any {
        if (!message.member.hasPermission('MANAGE_MESSAGES') && !userBypass(message.author.id)) {
            message.channel.send('You do not have the permission to manage messages.');
            return;
        }
        let purgeamnt = 5;
        if (!isNaN(Number(args[0]))) purgeamnt = Number(args[0]);
        if (purgeamnt > 100) {
            message.channel.send(`The purging limit is 100`);
        } else {
            (message.channel as TextChannel)
                .bulkDelete(purgeamnt)
                .then((messages: Discord.Collection<Discord.Snowflake, Discord.Message>) => {
                    message.channel
                        .send(`Purged ${messages.size} messages, deleting this in 2 seconds.`)
                        .then((msg) => {
                            msg.delete({
                                timeout: 2000,
                            }).catch(NOOP);
                        });
                })
                .catch((err: any) => message.channel.send(err.message));
        }
    }
}
