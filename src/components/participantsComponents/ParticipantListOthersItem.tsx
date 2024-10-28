import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Participant } from '../../@types/types';

export interface ParticipantListOthersItemOptions {
  participant: Participant;
  member: string;
  coHost: string;
}

export type ParticipantListOthersItemType = (
  options: ParticipantListOthersItemOptions
) => JSX.Element;

/**
 * Component representing an item in the participant list for others.
 *
 * @component
 * @param {ParticipantListOthersItemOptions} props - The properties for the component.
 * @param {Object} props.participant - The participant object.
 * @param {string} props.participant.name - The name of the participant.
 * @param {string} props.participant.islevel - The level of the participant.
 * @param {boolean} props.participant.muted - The muted status of the participant.
 * @param {string} props.member - The name of the current member.
 * @param {string} props.coHost - The name of the co-host.
 * @returns {JSX.Element} The rendered component.
 */
const ParticipantListOthersItem: React.FC<ParticipantListOthersItemOptions> = ({
  participant,
  member,
  coHost,
}) => (
  <View style={styles.container}>
    <View style={styles.nameContainer}>
      <Text style={styles.nameText}>
        {participant.islevel === '2'
          ? participant.name === member
            ? `${participant.name} (you)`
            : `${participant.name} (host)`
          : participant.name === member
            ? `${participant.name} (you)`
            : coHost === participant.name
              ? `${participant.name} (co-host)`
              : participant.name}
      </Text>
    </View>
    <View style={styles.iconContainer}>
      <FontAwesome
        name={participant.muted ? 'dot-circle-o' : 'dot-circle-o'}
        style={{ color: participant.muted ? 'red' : 'green' }}
      />
    </View>
    <View style={{ flex: 1, alignItems: 'flex-end' }} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameContainer: {
    flex: 8,
  },
  nameText: {
    fontSize: 16,
  },
  iconContainer: {
    flex: 4,
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
});

export default ParticipantListOthersItem;
