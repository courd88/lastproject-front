import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import food from './icon/food.png';
import kpop from './icon/kpop.png';
import place from './icon/place.png';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}));

const actions = [
  { icon: food, name: '음식' },
  { icon: place, name: '장소' },
  { icon: kpop, name: '문화' },
];

export default function PlaygroundSpeedDial() {
  const [direction, setDirection] = React.useState('up');
  const [hidden, setHidden] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const handleDirectionChange = (event) => {
    setDirection(event.target.value);
  };

  const handleActionClick = (category) => {
    handleClose();
    if (category === '음식') {
      navigate('/worldcup/1');
    } else if (category === '장소') {
      navigate('/worldcup/2');
    } else if (category === '문화') {
      navigate('/worldcup/3');
    }
  };

  return (
    <Tooltip title="Click!">
      <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
        <FormControl component="fieldset" sx={{ mt: 1, display: 'flex' }}>
          <RadioGroup
            aria-label="direction"
            name="direction"
            value={direction}
            onChange={handleDirectionChange}
            row
          >
          </RadioGroup>
        </FormControl>
        <Box sx={{ position: 'relative', mt: 3, height: 320 }}>
          <StyledSpeedDial
            ariaLabel="SpeedDial playground example"
            hidden={hidden}
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                // icon={action.icon}
                icon={<img src={action.icon} alt={action.name} style={{ width: '30px', height: '30px' }} />}
                // tooltipTitle={action.name}
                // tooltipOpen
                // onClick={() => {
                //   handleClose();
                // }}
                onClick={() => handleActionClick(action.name)}
              />
            ))}
          </StyledSpeedDial>
        </Box>
      </Box>
    </Tooltip>
  );
}