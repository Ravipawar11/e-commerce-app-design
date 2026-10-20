import React from 'react';
import { PlatformPressable } from '@react-navigation/elements';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export const HapticTab = (props) => {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Trigger haptic feedback on iOS
        ReactNativeHapticFeedback.trigger('impactLight', {
          enableVibrateFallback: true, // Vibrate on devices without Taptic Engine
          ignoreAndroidSystemSettings: false,
        });
        
        // Call the original press handler
        props.onPressIn?.(ev);
      }}
    />
  );
};