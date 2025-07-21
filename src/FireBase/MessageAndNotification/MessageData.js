
class MessageData {
  constructor({ sender_id, receiver_id, content, timestamp, is_read ,reciverName}) {
    this.sender_id = sender_id;
    this.receiver_id = receiver_id;
    this.content = content;
    this.timestamp = timestamp;
    this.is_read = is_read ?? false; // افتراضيًا false لو مش متحددة
    this.reciverName = reciverName;
  }
}

export default MessageData;
