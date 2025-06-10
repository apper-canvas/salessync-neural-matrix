import teamData from '../mockData/teamMembers.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let teamMembers = [...teamData];

const TeamMemberService = {
  async getAll() {
    await delay(250);
    return [...teamMembers];
  },

  async getById(id) {
    await delay(200);
    const member = teamMembers.find(m => m.id === id);
    if (!member) {
      throw new Error('Team member not found');
    }
    return { ...member };
  },

  async create(memberData) {
    await delay(300);
    const newMember = {
      ...memberData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    teamMembers.push(newMember);
    return { ...newMember };
  },

  async update(id, updates) {
    await delay(250);
    const index = teamMembers.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Team member not found');
    }
    teamMembers[index] = { ...teamMembers[index], ...updates };
    return { ...teamMembers[index] };
  },

  async delete(id) {
    await delay(200);
    const index = teamMembers.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Team member not found');
    }
    teamMembers.splice(index, 1);
    return true;
  }
};

export default TeamMemberService;