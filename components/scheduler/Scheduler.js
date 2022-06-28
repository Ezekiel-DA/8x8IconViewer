import {
  VStack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { emptyIcon } from "../../EmptyIcon";
import ScheduledTask from "./ScheduledTask";

import { MdAlarmAdd } from "react-icons/md";
import { BiMicrochip } from "react-icons/bi";

import { iconviewerURL } from "../../config";

function Menu({ onAddTask, onUpload, isDisabled }) {
  return (
    <div className={"scheduler-menu"}>
      <VStack>
        <IconButton
          isDisabled={isDisabled}
          isRound={true}
          size="lg"
          onClick={onAddTask}
          icon={<MdAlarmAdd />}
        />
        <IconButton
          isDisabled={isDisabled}
          isRound={true}
          size="lg"
          onClick={() => onUpload()}
          icon={<BiMicrochip />}
        />
      </VStack>
    </div>
  );
}

export default function Scheduler({ icons }) {
  const [tasks, setTasks] = useState([{ icon: emptyIcon, cron: "0 0 * * *" }]);

  const [uploading, setUploading] = useState(false);

  const toast = useToast();
  const toastIdRef = useRef();

  function dipslayStatus(state, message) {
    const toastConf = {
      status: state,
      title: message,
      isClosable: true,
    };
    if (toastIdRef.current) {
      toast.update(toastIdRef.current, toastConf);
    } else {
      toastIdRef.current = toast(toastConf);
    }
  }

  useEffect(() => {
    if(!uploading) {
        toastIdRef.current = null
    }
  }, [uploading])

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
    console.log(tasks);
    setTasks([...tasks]);
  };

  const handleUploadTasks = () => {
    setUploading(true);
    dipslayStatus("info", "Uploading...");
    fetch(new URL("", iconviewerURL), {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(tasks),
    })
      .then(() => dipslayStatus("success", "Uploaded"))
      .catch(e => dipslayStatus("error", e.toString()))
      .finally(() => setUploading(false));
  };

  return (
    <>
      <VStack>
        {tasks.map((task, idx) => (
          <ScheduledTask
            index={idx}
            icons={icons}
            onRemove={handleRemoveTask}
            cron={task.cron}
            onCronChange={v => handleCronChange(idx, v)}
            icon={task.icon}
            onIconChange={v => handleIconChange(idx, v)}
            isDeleteDisabled={tasks.length === 1}
          />
        ))}
        <Menu
          onAddTask={handleAddTask}
          onUpload={handleUploadTasks}
          isDisabled={uploading}
        />
      </VStack>
    </>
  );
}
