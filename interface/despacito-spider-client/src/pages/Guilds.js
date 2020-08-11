import React, { useState, useEffect } from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Sidebar from '../components/GuildSidebar';

// Components
import NavBar from '../components/Navbar';

// Other
import Cookies from 'universal-cookie';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  avatar: {
    width: 120,
    height: 120
  },
  cardSubComponents: {
    display: 'inline-block',
    verticalAlign: 'middle'
  }
}));

function Guilds(props) {
  const classes = useStyles();

  const [guilds, setGuilds] = useState();

  useEffect(() => {
    const cookies = new Cookies();
    if (cookies.get('access-token') !== undefined) {
      async function fetchData() {
        const res = await fetch('/despacito-spider-626fa/us-central1/guilds', {
          method: 'GET',
          headers: {
            'access-token': cookies.get('access-token')
          }
        });
        res
          .json()
          .then((json) => {
            if (json.message) console.log(json.message);
            else setGuilds(json.guilds);
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
      fetchData();
    } else props.history.push('/');
  }, [props.history]);  

  const guildItems = [];

  for (var guild in guilds) {
    guildItems.push(
      <Card className={classes.root}>
        <CardActionArea
          // eslint-disable-next-line
          onClick={() => {
            const cookies = new Cookies();
            if (cookies.get('recent-servers') === undefined && cookies.get('access-token') !== undefined) {
              cookies.set('recent-servers',[]);
            }
            if (cookies.get('recent-servers') !== undefined && cookies.get('access-token') !== undefined) {
              for (var x = 0; x < cookies.get('recent-servers').length; x++) {
                if (cookies.get('recent-servers')[x].id === guild) {
                  props.history.push(`/guild/${guild}`);
                  return;
                }
              }
              var pushArray = cookies.get('recent-servers');
              var tempDict = guilds[guild];
              tempDict['id'] = guild;
              pushArray.unshift(tempDict);
              if (pushArray.length > 6) {
                pushArray.splice(6);
              }
              cookies.set('recent-servers', pushArray);
            }
            props.history.push(`/guild/${guild}`);
          }}
        >
          <CardHeader
            className={classes.cardSubComponents}
            avatar={
              <Avatar className={classes.avatar}>
                <img src={guilds[guild].iconURL} alt={`Guild Icon for ${guilds[guild].name}`} />
              </Avatar>
            }
          />
          <CardContent className={classes.cardSubComponents}>
            <Typography style={{ textTransform: 'none', fontSize: 30 }}>
              {guilds[guild].name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
  return (
    <div>
      <NavBar location={props.location} history={props.history} />
      <Sidebar />
      <div className="container">{guilds ? guildItems : <Typography>Loading...</Typography>}</div>
    </div>
  );
}

export default Guilds;
