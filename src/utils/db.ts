interface StorageData {
  users: User[];
  reports: Report[];
  lastId: {
    user: number;
    report: number;
  };
}

class LocalStorage {
  private static instance: LocalStorage;
  private readonly STORAGE_KEY = 'billy_app_data';

  private constructor() {
    this.initializeStorage();
  }

  public static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }

  private initializeStorage() {
    const existingData = localStorage.getItem(this.STORAGE_KEY);
    
    if (!existingData) {
      const initialData: StorageData = {
        users: [{
          id: 1,
          username: 'admin',
          password: 'Admin@123',
          fullName: 'System Administrator',
          userType: 'admin',
          createdAt: new Date().toISOString()
        }],
        reports: [],
        lastId: {
          user: 1,
          report: 0
        }
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
    }
  }

  private getData(): StorageData {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return JSON.parse(data!) as StorageData;
  }

  private saveData(data: StorageData) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  public async getUser(username: string): Promise<User | undefined> {
    const data = this.getData();
    return data.users.find(user => user.username === username);
  }

  public async addUser(user: Omit<User, 'id' | 'createdAt'>): Promise<number> {
    const data = this.getData();
    const newId = data.lastId.user + 1;
    
    const newUser: User = {
      id: newId,
      ...user,
      createdAt: new Date().toISOString()
    };

    data.users.push(newUser);
    data.lastId.user = newId;
    
    this.saveData(data);
    return newId;
  }

  public async addReport(report: Omit<Report, 'id' | 'createdAt'>): Promise<number> {
    const data = this.getData();
    const newId = data.lastId.report + 1;
    
    const newReport: Report = {
      id: newId,
      ...report,
      createdAt: new Date().toISOString()
    };

    data.reports.push(newReport);
    data.lastId.report = newId;
    
    this.saveData(data);
    return newId;
  }

  public async getAllReports(): Promise<Report[]> {
    const data = this.getData();
    return [...data.reports].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public async getReports(userId: number): Promise<Report[]> {
    const data = this.getData();
    return data.reports
      .filter(report => report.userId === userId)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  public async updateReportStatus(id: number, status: Report['status']): Promise<void> {
    const data = this.getData();
    const reportIndex = data.reports.findIndex(report => report.id === id);
    
    if (reportIndex !== -1) {
      data.reports[reportIndex].status = status;
      this.saveData(data);
    }
  }
}

export interface User {
  id: number;
  username: string;
  password: string;
  fullName: string;
  userType: 'admin' | 'user';
  createdAt: string;
}

export interface Report {
  id: number;
  userId: number;
  incidentType: string;
  description: string;
  evidence: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  createdAt: string;
  reporterName: string;
}

// Create and export storage instance
const storage = LocalStorage.getInstance();

// Export storage operations
export const getUser = (username: string) => storage.getUser(username);
export const addUser = (user: Omit<User, 'id' | 'createdAt'>) => storage.addUser(user);
export const addReport = (report: Omit<Report, 'id' | 'createdAt'>) => storage.addReport(report);
export const getAllReports = () => storage.getAllReports();
export const getReports = (userId: number) => storage.getReports(userId);
export const updateReportStatus = (id: number, status: Report['status']) => storage.updateReportStatus(id, status);