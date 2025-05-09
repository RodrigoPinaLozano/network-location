/**
 * Network Location Switcher for Raycast
 *
 * This extension allows users to quickly switch between macOS network locations.
 * It uses the networksetup command to list and switch between locations.
 */

import { ActionPanel, Action, List, Toast, showToast } from "@raycast/api";
import React, { useState, useEffect } from "react";
import { runAppleScript } from "run-applescript";
import { spawnSync } from "child_process";

// Constants for system commands
const NETWORKSETUP_PATH = "/usr/sbin/networksetup";
const LIST_LOCATIONS_ARGS = ["-listlocations"];
const GET_CURRENT_LOCATION_ARGS = ["-getcurrentlocation"];

export default function Command() {
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  /**
   * Fetches all available network locations and the current active location
   * Uses the networksetup command-line tool to retrieve this information
   */
  async function fetchLocations() {
    try {
      // Get all available network locations
      const locationsProcess = spawnSync(NETWORKSETUP_PATH, LIST_LOCATIONS_ARGS);

      // Get the currently active network location
      const currentLocationProcess = spawnSync(NETWORKSETUP_PATH, GET_CURRENT_LOCATION_ARGS);

      // Handle any errors from the commands
      if (locationsProcess.error || currentLocationProcess.error) {
        throw new Error("Failed to fetch network locations");
      }

      const locationsList = locationsProcess.stdout.toString().trim().split("\n");
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

  /**
   * Switches to the specified network location
   *
   * @param location - The name of the network location to switch to
   *
   * This function uses AppleScript with administrator privileges to switch
   * network locations, as this operation requires elevated permissions.
   */
  async function switchLocation(location) {
    setIsLoading(true);

    try {
      // Execute the networksetup command with administrator privileges via AppleScript
      // The "with administrator privileges" flag will prompt the user for their password
      // when needed, allowing the command to run with the necessary permissions
      await runAppleScript(`
        do shell script "${NETWORKSETUP_PATH} -switchtolocation \\"${location}\\"" with administrator privileges
      `);

      // Update the UI to reflect the new location
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
              <Action title="Switch Location" onAction={() => switchLocation(location)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
