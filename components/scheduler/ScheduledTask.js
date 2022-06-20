import React, { useState } from "react";

import Select from "react-select";
import { Grid, Box, Button, Center } from "@chakra-ui/react";

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
          <Button onClick={() => onRemove(index)}>Remove</Button>{" "}
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
