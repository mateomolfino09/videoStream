import React, { ElementType, useState, forwardRef, useRef, useEffect } from 'react'
import { Slider, styled, Tooltip, Popover, SliderValueLabelProps } from '@mui/material';
import {
  BackwardIcon,
  ForwardIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  
} from "@heroicons/react/24/solid";

// ElementType<ValueLabelProps>
function ValueLabelComponent(props: SliderValueLabelProps) {
    const { children, value } = props;
  
    return (
      <Tooltip enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }

  const PrettoSlider = styled(Slider)({
    color: '#e50914',
    height: 3,
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-thumb': {
      height: 10,
      width: 10,
      backgroundColor: '#e52019',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&:before': {
        display: 'none',
      },
    },
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 12,
      background: 'unset',
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: '50% 50% 50% 0',
      backgroundColor: 'transparent',
      transformOrigin: 'bottom left',
      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
      '&:before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
      },
      '& > *': {
        transform: 'rotate(-45deg)',
      },
    },
  });

  interface Props {
    onPlayPause: any
    playing: boolean
    onFastForward: any
    onRewind: any
    muted: boolean,
    onMute: any,
    onVolumeSeekUp: any
    onVolumeChange: any
    volume: number
    playbackRate: number
    onPlaybackRateChange: any
    onToggleFullScreen: any
    fullScreen: boolean
    played: number
    onSeek: any
    onSeekMouseDown: any
    onSeekMouseUp: any
    elapsedTime: any
    totalDuration: any
    onBookmark: any
    setPlayerRef: any
    title: string
  }
  

export default function PlayerControls ({ onPlayPause, playing, onFastForward, onRewind, muted, onMute, onVolumeChange, onVolumeSeekUp, volume, playbackRate, onPlaybackRateChange , onToggleFullScreen, fullScreen, played, onSeek, onSeekMouseDown, onSeekMouseUp, elapsedTime, totalDuration, onBookmark, setPlayerRef, title}: Props) {

    const ref = useRef<HTMLDivElement>(null);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handlePopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if(ref != null && setPlayerRef != null) setPlayerRef(ref)
}, [ref])   


  const open = Boolean(anchorEl);
  const id = open ? 'playbackrate-popover' : undefined;

return (
    <div ref={ref} className={`absolute top-[60px] lg:top-[75px] left-0 right-0 bottom-0 flex-col space-y-48 justify-between z-[1] ${fullScreen ? 'bg-transparent' : 'bg-black/20'}  w-full flex-wrap box-border`}>
    <div className={`${fullScreen ? '!hidden' : 'hidden'} h-20 !pb-0 lg:overflow-hidden flex flex-row items-center justify-between p-4`}> 
      <div className='w-[80%] h-16'>
        <h5 className='text-white !text-lg'>{title}</h5>
      </div>
      <div className='hidden lg:flex'>
      </div>
    </div>


    <div className={`${fullScreen ? '!mt-96' : '!mt-0 relative md:!mt-1 top-36 lg:top-32 h-40'} flex flex-row items-center justify-center  w-full flex-wrap box-border`}>
      <button onClick={onRewind} className='!text-[#e6e5e5] !text-5xl !transform !scale-90 hover:!text-[#fff] !hover:transform !hover:scale-100 w-10 h-10' aria-label='required'>
        <BackwardIcon fontSize='inherit'/>
      </button>

      <button onClick={onPlayPause} className='!text-[#e6e5e5] !text-5xl !transform !scale-90 hover:!text-[#fff] !hover:transform !hover:scale-100 h-8 w-8' aria-label='required'>
        {playing ? <PauseIcon fontSize='inherit'/> : <PlayIcon fontSize='inherit'/> }
      </button>

      <button onClick={onFastForward} className='!text-[#e6e5e5] !text-5xl !transform !scale-90 hover:!text-[#fff] !hover:transform !hover:scale-100 h-10 w-10' aria-label='required'>
        <ForwardIcon fontSize='inherit'/>
      </button>
    </div>
    <div className={`${fullScreen ? !playing ? 'md:!mt-64' : 'md:!mt-[450px]' : ' relative md:top-72 md:!mt-0'} flex flex-row justify-between items-center p-4 w-full flex-wrap box-border`}>
      <div className='w-full'>
        <PrettoSlider 
          min={0}
          max={100}
          value={played * 100}
          slots={{
            valueLabel: (props: any)=>(
              <ValueLabelComponent {...props} value={elapsedTime}/>
              )
          }}
          onChange={onSeek}
          onMouseDown={onSeekMouseDown}
          onChangeCommitted={onSeekMouseUp}/>
      </div>
    <div className='w-full flex flex-row justify-between mt-0 flex-wrap box-border'>
      <div className='flex w-1/2 flex-row items-center space-x-4'>
        <button onClick={onPlayPause} className='!text-[#e6e5e5] hover:!text-white h-7 w-7'>
        {playing ? <PauseIcon fontSize='large'/> : <PlayIcon fontSize='large'/> }
          
        </button>

        <button onClick={onMute} className='!text-[#e6e5e5] hover:!text-white h-7 w-7 mr-2'>
          {muted ? <SpeakerXMarkIcon fontSize='large'/> : <SpeakerWaveIcon fontSize='large'/>}
        </button>

        {/* <Slider 
          min={0}
          max={100}
          size='small'
          defaultValue={volume / 100}
          color='primary'
          className='!w-[20%] !text-[white]'
          onChange={onVolumeChange}
          onChangeCommitted={onVolumeSeekUp}/> */}

          <button className='text-white ml-4'>
            <p> {elapsedTime}/{totalDuration}</p>
          </button>
      </div>
      <div className='flex justify-end items-center'>
        <button className='!text-[#e6e5e5] hover:!text-white h-7 w-7' onClick={handlePopover}>
          <p>{playbackRate}X</p>
        </button>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
        >
          <div className='flex flex-wrap box-border flex-col-reverse'>
            {[0.5,1,1.5,2].map((rate => (
            <button key={rate} onClick={() => onPlaybackRateChange(rate)} className='h-6 w-6'>
              <p color={rate === playbackRate ? 'secondary' : 'primary'}>{rate}</p>
            </button>
            )))}
          </div>


        </Popover>

        <button onClick={onToggleFullScreen} className='!text-[#e6e5e5] hover:!text-white h-6 w-6'>
          <ArrowsPointingOutIcon fontSize='large'/>
        </button>
      </div>
    </div>

  </div>

</div>
)}