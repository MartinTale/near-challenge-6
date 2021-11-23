import { context, u128, PersistentUnorderedMap } from "near-sdk-as";

/** 
 * Exporting a new class PostedMessage so it can be used outside of this file.
 */
@nearBindgen
export class User {
  premium: boolean;
  // deposits: Deposit[];
  timestamp: u64;
  votes: number;
  constructor(
    public name: string,
    public avatar: string
  ) {
    this.premium = context.attachedDeposit >= u128.from("10000000000000000000000");
    // this.deposits.push(new Deposit());
    this.timestamp = context.blockTimestamp / 1e6;
    this.votes = 0;
  }
}

// export class Deposit {
//   public timestamp: u64;
//   public amount: u128;
//   public sender: string;

//   constructor() {
//     this.sender = context.sender;
//     this.amount = context.attachedDeposit;
//     this.timestamp = context.blockTimestamp;
//   }
// }
/**
 * collections.vector is a persistent collection. Any changes to it will
 * be automatically saved in the storage.
 * The parameter to the constructor needs to be unique across a single contract.
 * It will be used as a prefix to all keys required to store data in the storage.
 */
export const users = new PersistentUnorderedMap<string, User>("m");
