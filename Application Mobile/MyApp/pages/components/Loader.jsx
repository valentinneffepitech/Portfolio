import React from 'react'
import { ActivityIndicator } from 'react-native';

export const Loader = () => {
    return (
        <ActivityIndicator size="large" color="#1f1f1f" style={{
            marginVertical: 30
        }} />
    )
}
