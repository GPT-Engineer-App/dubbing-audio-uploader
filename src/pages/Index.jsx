import React, { useState } from "react";
import { Container, VStack, Text, Button, Input, IconButton, Box, Spinner } from "@chakra-ui/react";
import { FaMicrophone, FaUpload } from "react-icons/fa";
import SpeechToText from "speech-to-text";

const Index = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      processAudio(file);
    }
  };

  const processAudio = (file) => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const audioData = e.target.result;
      try {
        const result = await SpeechToText.recognize(audioData);
        setTranscript(result);
      } catch (err) {
        setError("Erreur lors de la reconnaissance vocale.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Reconnaissance de Doublage Français</Text>
        <Input type="file" accept="audio/*" onChange={handleFileUpload} display="none" id="audio-upload" />
        <label htmlFor="audio-upload">
          <IconButton as="span" aria-label="Upload Audio" icon={<FaUpload />} size="lg" />
        </label>
        {isLoading && <Spinner />}
        {transcript && (
          <Box p={4} borderWidth={1} borderRadius="md" width="100%">
            <Text fontSize="lg">Transcription :</Text>
            <Text>{transcript}</Text>
          </Box>
        )}
        {error && (
          <Box p={4} borderWidth={1} borderRadius="md" width="100%" bg="red.100">
            <Text color="red.500">{error}</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
