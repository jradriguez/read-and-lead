import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput } from "react-native";
import { makeChallenge, checkGate } from "./gate";
import { ui } from "../../ui/tokens";
export function ParentGate({
  onOpen,
  onExit,
  random = Math.random,
}: {
  onOpen: () => void;
  onExit: () => void;
  random?: () => number;
}) {
  const challenge = () =>
    makeChallenge(11 + Math.floor(random() * 9), 11 + Math.floor(random() * 9));
  const [current, setCurrent] = useState(challenge);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  return (
    <ScrollView
      style={ui.page}
      contentContainerStyle={[ui.content, { paddingTop: 70 }]}
    >
      <Text style={ui.title}>Grown-up time</Text>
      <Text style={ui.body}>{current.prompt}</Text>
      <TextInput
        accessibilityLabel="Grown-up answer"
        value={input}
        onChangeText={setInput}
        keyboardType="number-pad"
        style={ui.input}
      />
      {error ? <Text style={ui.error}>Try this new question.</Text> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open parent area"
        onPress={() => {
          if (checkGate(input, current.answer)) onOpen();
          else {
            setCurrent(challenge());
            setInput("");
            setError(true);
          }
        }}
        style={ui.button}
      >
        <Text style={ui.buttonText}>Open parent area</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onExit}
        style={[ui.button, ui.secondary]}
      >
        <Text style={[ui.buttonText, ui.secondaryText]}>Back to workshop</Text>
      </Pressable>
      <Text style={ui.small}>
        This question helps keep settings in grown-up hands. It is not a
        password.
      </Text>
    </ScrollView>
  );
}
