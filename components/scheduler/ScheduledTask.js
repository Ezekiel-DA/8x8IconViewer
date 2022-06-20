import React, { useState } from "react";

import Select from "react-select";
import { Grid, Box, IconButton, Center } from "@chakra-ui/react";
import { MdOutlineAutoDelete } from "react-icons/md";

import IconViewer from "../IconViewer";
import Cron from "./Cron";

export default function ScheduledTask({
  index,
  icons,
  onRemove,
  cron,
  onCronChange,
  icon,
  onIconChange,
  isDeleteDisabled
}) {
  let options = icons.map(icon => {
    return { value: icon, label: icon.name };
  });
  return (
    <Box p="4" borderWidth="2px" borderRadius="lg">
      <Grid
        gridTemplateRows={"min-content 1fr"}
        gridTemplateColumns={"1fr 1fr"}
        gap="24px"
      >
        <Select
          value={icon?.label}
          onChange={e => onIconChange(e.value)}
          options={options}
        />
        <Grid gridTemplateColumns={"1fr min-content"}>
          <span />
          <IconButton isDisabled={isDeleteDisabled} isRound={true} variant='outline' icon={<MdOutlineAutoDelete/>} onClick={() => onRemove(index)}/>
        </Grid>
        <Center>{icon ? <IconViewer iconData={icon} displayInfo = {false}/> : <></>}</Center>
        <Grid gridTemplateRows={"min-content 1fr"}>
          <Cron value={cron} onChange={onCronChange} />
          <span />
        </Grid>
      </Grid>
    </Box>
  );
}
