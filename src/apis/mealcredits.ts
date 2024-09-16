// Method to get the balance of a specific account for a user
const getBalance = (userId: string, accountName: string, accounts: any[]): number | null => {
    const userAccount = accounts.find(
      (account) => account.userId === userId
    );
  
    if (!userAccount) return null; // Return null if user not found
  
    const account = userAccount.Accounts.find(
      (acc: any) => acc.accountName === accountName
    );
  
    return account ? account.balance : null; // Return balance if account is found, otherwise null
  };
  
  // Method to update the balance of a specific account
const updateBalance = (
    userId: string, 
    accountName: string, 
    amount: number, 
    type: 'in' | 'out', 
    accounts: any[]
  ) => {
    const userAccount = accounts.find(
      (account) => account.userId === userId
    );
  
    if (!userAccount) return; // Return if user not found
  
    const account = userAccount.Accounts.find(
      (acc: any) => acc.accountName === accountName
    );
  
    if (account) {
      const transaction = {
        amount: Math.abs(amount), 
        date: new Date().toISOString(),
      };
  
      // Update balance and transactions based on type
      if (type === 'in') {
        account.balance += amount;
        account.transactions.moneyIn.push(transaction);
      } else if (type === 'out' && account.balance >= amount) {
        account.balance -= amount;
        account.transactions.moneyOut.push(transaction);
      }
    }
  };
  