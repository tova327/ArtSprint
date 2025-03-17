using Server.Core.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.Repositories
{
    public interface IUserRepository:IRepository<UserModel>
    {
        Task<UserModel> GetUserDetailsByIdAsync(int id);
        Task UpdateUserNameAsync(int id, string name);
        Task UpdateUserCameOnAsync(int id, DateTime cameOn);
        Task UpdateUserIsMedalAsync(int id, bool isMedal);
        Task UpdateUserLastPaintAsync(int id, DateTime? lastPaint);
    }
}
