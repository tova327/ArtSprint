using Server.Core.DTOs;
using Server.Core.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.Services
{
    public interface IUserService
    {
        Task<UserDTO> GetUserDetailsByIdAsync(int id);
        Task UpdateUserNameAsync(int id, string name);
        Task UpdateUserCameOnAsync(int id, DateTime cameOn);
        Task UpdateUserIsMedalAsync(int id, bool isMedal);
        Task UpdateUserLastPaintAsync(int id, DateTime? lastPaint);
        Task<IEnumerable<UserDTO>> GetAllAsync();
        Task<UserDTO?> GetByIdAsync(int id);

        Task<UserDTO> AddAsync(UserDTO entity);

        Task<UserDTO> UpdateAsync(int id, UserDTO entity);

        Task DeleteAsync(int id);
        public Task<UserDTO> GetUserByUsername(string username);
    }
}
