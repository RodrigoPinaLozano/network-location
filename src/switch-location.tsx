import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
// import { runAppleScript } from "run-applescript";
import { useExec } from "@raycast/utils";
import { execSync } from "child_process";

interface Location {
  name: string;
}

const SwitchLocation = async (location: string) => {
  await execSync(`/usr/sbin/networksetup -switchtolocation "${location}"`);
};

export default function Command() {
  const [locations, setLocations] = useState<Location[]>([]);
  const { data: currentLocation, revalidate } = useExec("/usr/sbin/networksetup", ["-getcurrentlocation"]);
  const { data } = useExec("/usr/sbin/networksetup", ["-listlocations"], {});

  useEffect(() => {
    if (data) {
      setLocations(
        data
          .split("\n")
          .filter((line) => line !== "")
          .map((line) => ({ name: line }))
      );
    }
  }, [data]);

  return (
    <List>
      {locations.map((location, i) => (
        <List.Item
          key={i}
          title={location.name}
          icon={{ source: Icon.Map, tintColor: location.name === currentLocation ? Color.Blue : undefined }}
          actions={
            <ActionPanel>
              <Action
                title="Switch"
                onAction={async () => {
                  await SwitchLocation(location.name);
                  setTimeout(() => {
                    revalidate();
                  }, 100);
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
