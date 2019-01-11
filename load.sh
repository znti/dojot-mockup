#!/bin/bash

serverUrl="localhost:8080"

totalDevices=1000
messagesPerDevice=1000

for i in $(seq ${totalDevices}); do
	deviceId="device_$(printf "%04d" ${i})"

	echo "Creating device ${deviceId}"

	curl -X POST -H 'Content-Type:application/json' -d "{\"deviceId\":\"${deviceId}\"}" "${serverUrl}/devices"

	echo ""
done;

echo "Firing ${messagesPerDevice} for each of the ${totalDevices} devices"
sleep 1

for i in $(seq ${totalDevices}); do
	deviceId="device_$(printf "%04d" ${i})"

	echo "Publishing ${messagesPerDevice} messages for device ${deviceId}"

	for j in $(seq ${messagesPerDevice}); do
		curl -X POST -H 'Content-Type:application/json' -d '{"text":"hi"}' "${serverUrl}/devices/${deviceId}/messages"
		sleep 0.01
	done &

done
