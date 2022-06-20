import { Button, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { emptyIcon } from "../../EmptyIcon";
import ScheduledTask from "./ScheduledTask";

export default function Scheduler({ icons }) {

  const [tasks, setTasks] = useState([]);

  const handleRemoveTask = index => {
    setTasks([...tasks.filter((t, idx) => idx !== index)]);
  };

  const handleAddTask = () => {
    setTasks([...tasks, { icon: emptyIcon, cron: "0 0 * * *" }]);
  };

  const handleCronChange = (index, cron) => {
    tasks[index] = {
      ...tasks[index],
      cron: cron,
    };
    setTasks([...tasks]);
  };

  const handleIconChange = (index, icon) => {
    tasks[index] = {
      ...tasks[index],
      icon: icon,
    };
    console.log(tasks)
    setTasks([...tasks]);
  };

  return (
    <VStack>
      {tasks.map((task, idx) => (
        <ScheduledTask
          index={idx}
          icons={icons}
          onRemove={handleRemoveTask}
          cron={task.cron}
          onCronChange={(v) => handleCronChange(idx, v)}
          icon={task.icon}
          onIconChange={(v) => handleIconChange(idx, v)}
        />
      ))}
      <Button onClick={handleAddTask}>Add</Button>
    </VStack>
  );
}
