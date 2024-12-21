import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../theme';

interface LinkProps extends TouchableOpacityProps {
  title: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const Link: React.FC<LinkProps> = ({
  title,
  containerStyle,
  textStyle,
  ...props
}) => {
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} {...props}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
  },
  text: {
    color: theme.colors.primary,
    fontSize: 14,
  },
}); 