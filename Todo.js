import { View, Text } from 'react-native'
import React from 'react'
import { Button, IconButton, List } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'

export default function Todo({ id, title, complete}) {
    async function toggleComplete() {
        await firestore()
            .collection('todos')
            .doc(id)
            .update({
                complete: !complete,
            });
    }
    async function handleDelete() {
        await firestore()
            .collection('todos')
            .doc(id)
            .delete();
    }

    return (
        <List.Item
            title={title}
            onPress={() => toggleComplete()}
            left={props => (
                <List.Icon {...props} icon={complete ? 'check' : 'cancel'} />
            )}
            right={props =>(
                <Button {...props} mode="text" icon="delete" onPress={()=>handleDelete(id)}/>
            )}
        />
    );
}