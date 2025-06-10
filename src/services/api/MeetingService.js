import meetingData from '../mockData/meetings.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let meetings = [...meetingData];

const MeetingService = {
  async getAll() {
    await delay(350);
    return [...meetings];
  },

  async getById(id) {
    await delay(200);
    const meeting = meetings.find(m => m.id === id);
    if (!meeting) {
      throw new Error('Meeting not found');
    }
    return { ...meeting };
  },

  async create(meetingData) {
    await delay(400);
    const newMeeting = {
      ...meetingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    meetings.push(newMeeting);
    return { ...newMeeting };
  },

  async update(id, updates) {
    await delay(300);
    const index = meetings.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Meeting not found');
    }
    meetings[index] = { ...meetings[index], ...updates };
    return { ...meetings[index] };
  },

  async delete(id) {
    await delay(250);
    const index = meetings.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Meeting not found');
    }
    meetings.splice(index, 1);
    return true;
  }
};

export default MeetingService;