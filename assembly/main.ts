// import { PostedMessage, messages } from './model';

// // --- contract code goes below

// // The maximum number of latest messages the contract returns.
// const MESSAGE_LIMIT = 10000;

// /**
//  * Adds a new message under the name of the sender's account id.\
//  * NOTE: This is a change method. Which means it will modify the state.\
//  * But right now we don't distinguish them with annotations yet.
//  */
// export function addMessage(text: string): void {
//   // Creating a new message and populating fields with our data
//   const message = new PostedMessage(text);
//   // Adding the message to end of the the persistent collection
//   messages.push(message);
// }

// /**
//  * Returns an array of last N messages.\
//  * NOTE: This is a view method. Which means it should NOT modify the state.
//  */
// export function getMessages(): PostedMessage[] {
//   const numMessages = min(MESSAGE_LIMIT, messages.length);
//   const startIndex = messages.length - numMessages;
//   const result = new Array<PostedMessage>(numMessages);
//   for(let i = 0; i < numMessages; i++) {
//     result[i] = messages[i + startIndex];
//   }
//   return result;
// }


import { context, MapEntry } from 'near-sdk-core';
import { User, users } from './model';

/**
 * NOTE: This is a change method. Which means it will modify the state.\
 * But right now we don't distinguish them with annotations yet.
 */
export function setUser(name: string, avatar: string): void {
  if (users.contains(context.sender)) {
    return;
  }
  const message = new User(name, avatar);
  users.set(context.sender, message);
}

export function vote(account: string): void {
  const originalEntry = users.get(account);

  if (originalEntry) {
    originalEntry.votes += 1;
    users.set(account, originalEntry);
  }
}

/**
 * Returns an array of all users.\
 * NOTE: This is a view method. Which means it should NOT modify the state.
 */
export function getUsers(): MapEntry<string, User>[] {
  return users.entries();
}
