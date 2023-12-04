import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Video } from 'react-native-video';
import { AudioRecorder, AudioUtils } from 'react-native-audio';

const CameraApp = () => {
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startAudioRecording = async () => {
    try {
      await AudioRecorder.startRecording();
      setIsRecording(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to start audio recording');
    }
  };

  const stopAudioRecording = async () => {
    try {
      await AudioRecorder.stopRecording();
      setIsRecording(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to stop audio recording');
    }
  };

  const startVideoRecording = async () => {
    try {
      const recording = await cameraRef.current.recordAsync();
      setVideoUri(recording.uri);
      await AudioRecorder.startRecording();
      setIsRecording(true);
      setIsVideoRecording(true);
      setTimer(0);
    } catch (error) {
      Alert.alert('Error', 'Failed to start video recording');
    }
  };

  const stopVideoRecording = async () => {
    try {
      if (cameraRef.current) {
        cameraRef.current.stopRecording();
      }
      await AudioRecorder.stopRecording();
      setIsRecording(false);
      setIsVideoRecording(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to stop video recording');
    }
  };

  const switchCamera = () => {
    setCameraType(prevCameraType =>
      prevCameraType === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back
    );
  };

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return $;{minutes.toString().padStart(2, '0')};$;{seconds.toString().padStart(2, '0')};
  };

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        ref={cameraRef}
        style={{ flex: 1 }}
        type={cameraType}
      />
      {videoUri && (
        <Video
          source={{ uri: videoUri }}
          style={{ flex: 1 }}
          repeat={true}
          controls={true}
        />
      )}
      <Text>{formatTime(timer)}</Text>
      <TouchableOpacity
        onPress={isVideoRecording ? stopVideoRecording : startVideoRecording}
      >
        <Text>{isVideoRecording ? 'Stop Video Recording' : 'Start Video Recording'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={isRecording ? stopAudioRecording : startAudioRecording}
      >
        <Text>{isRecording ? 'Stop Audio Recording' : 'Start Audio Recording'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={switchCamera}
      >
        <Text>Switch Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CameraApp;