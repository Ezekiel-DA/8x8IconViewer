// 0 0 1 1 *

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Input,
  Flex,
  Text,
  Center,
  Heading,
} from "@chakra-ui/react";

const MIN_REGEX =
  /^(\*|[1-5]?[0-9](-[1-5]?[0-9])?)(\/[1-9][0-9]*)?(,(\*|[1-5]?[0-9](-[1-5]?[0-9])?)(\/[1-9][0-9]*)?)*$/g;
const HOUR_REGEX =
  /^(\*|(1?[0-9]|2[0-3])(-(1?[0-9]|2[0-3]))?)(\/[1-9][0-9]*)?(,(\*|(1?[0-9]|2[0-3])(-(1?[0-9]|2[0-3]))?)(\/[1-9][0-9]*)?)*$/g;
const MDAY_REGEX =
  /^(\*|([1-9]|[1-2][0-9]?|3[0-1])(-([1-9]|[1-2][0-9]?|3[0-1]))?)(\/[1-9][0-9]*)?(,(\*|([1-9]|[1-2][0-9]?|3[0-1])(-([1-9]|[1-2][0-9]?|3[0-1]))?)(\/[1-9][0-9]*)?)*$/g;
const MONTH_REGEX =
  /^(\*|([1-9]|1[0-2]?)(-([1-9]|1[0-2]?))?)(\/[1-9][0-9]*)?(,(\*|([1-9]|1[0-2]?)(-([1-9]|1[0-2]?))?)(\/[1-9][0-9]*)?)*$/g;
const WDAY_REGEX =
  /^(\*|[0-6](-[0-6])?)(\/[1-9][0-9]*)?(,(\*|[0-6](-[0-6])?)(\/[1-9][0-9]*)?)*$/g;

function CronInput({ label, value, onValueChange, regex }) {
  return (
    <Grid
      templateColumns="120px minmax(80px, 1fr)"
      gap={4}
      style={{ alignContent: "center" }}
    >
      <GridItem style={{ justifyContent: "center" }}>
        <Text
          casing={"uppercase"}
          style={{
            fontWeight: "700",
            justifyContent: "center",
            alignContent: "center",
          }}
          fontSize="xs"
        >
          {label}:
        </Text>
      </GridItem>
      <GridItem>
        <Input
          value={value}
          isInvalid={!value?.match(regex)}
          onChange={evt => {
            onValueChange(evt.target.value);
          }}
        />
      </GridItem>
    </Grid>
  );
}

export default function Cron({ value, onChange }) {
  const cronConfig = value.split(" ");

  const [min, setMin] = useState(cronConfig[0]);
  const [hour, setHour] = useState(cronConfig[1]);
  const [mDay, setmDay] = useState(cronConfig[2]);
  const [month, setMonth] = useState(cronConfig[3]);
  const [wDay, setwDay] = useState(cronConfig[4]);

  useEffect(() => {
    onChange(`${min} ${hour} ${mDay} ${month} ${wDay}`);
  }, [min, hour, mDay, month, wDay]);

  return (
    <Grid gap={6} className="cron">
      <Heading as="h1" size="sm">
        CRON config
      </Heading>
      <Grid gap={2} className="cron">
        <CronInput
          label="Minutes"
          value={min}
          onValueChange={setMin}
          regex={MIN_REGEX}
        />
        <CronInput
          label="Hours"
          value={hour}
          onValueChange={setHour}
          regex={HOUR_REGEX}
        />
        <CronInput
          label="Month's days"
          value={mDay}
          onValueChange={setmDay}
          regex={MDAY_REGEX}
        />
        <CronInput
          label="Months"
          value={month}
          onValueChange={setMonth}
          regex={MONTH_REGEX}
        />
        <CronInput
          label="Week's days"
          value={wDay}
          onValueChange={setwDay}
          regex={WDAY_REGEX}
        />
      </Grid>
    </Grid>
  );
}
