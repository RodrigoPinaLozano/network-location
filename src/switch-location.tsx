import { ActionPanel, Action, List, Toast, showToast } from "@raycast/api";
import { useState, useEffect } from "react";
import { runAppleScript } from "run-applescript";
import { spawnSync } from "child_process";

export default function Command() {
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    try {
      const locationsProcess = spawnSync("/usr/sbin/networksetup", [
        "-listlocations",
      ]);
      const currentLocationProcess = spawnSync("/usr/sbin/networksetup", [
        "-getcurrentlocation",
      ]);

      if (locationsProcess.error || currentLocationProcess.error) {
        throw new Error("Failed to fetch network locations");
      }

      const locationsList = locationsProcess.stdout
        .toString()
        .trim()
        .split("\n");
      const current = currentLocationProcess.stdout.toString().trim();

      setLocations(locationsList);
      setCurrentLocation(current);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch locations",
        message: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function switchLocation(location) {
    setIsLoading(true);

    try {
      await runAppleScript(`
        do shell script "/usr/sbin/networksetup -switchtolocation \\"${location}\\"" with administrator privileges
      `);

      setCurrentLocation(location);

      await showToast({
        style: Toast.Style.Success,
        title: "Location Switched",
        message: `Switched to ${location}`,
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Switch Location",
        message: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <List isLoading={isLoading}>
      {locations.map((location) => (
        <List.Item
          key={location}
          title={location}
          icon={location === currentLocation ? "✅" : "⭕️"}
          actions={
            <ActionPanel>
              <Action
                title="Switch Location"
                onAction={() => switchLocation(location)}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
