using AutoMapper;
using Server.Core.DTOs;
using Server.Core.models;
using Server.Core.Repositories;
using Server.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Service.Services
{
    public class UserService : IUserService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public UserService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager; 
            _mapper = mapper;
        }
        public async Task<UserDTO> AddAsync(UserDTO entity)
        {
            var user=await _repositoryManager.Users.AddAsync(_mapper.Map<UserModel>(entity));
            await _repositoryManager.SaveAsync();
            return _mapper.Map<UserDTO>(user);
        }

        public async Task DeleteAsync(int id)
        {
            await _repositoryManager.Users.DeleteAsync(id);
            await _repositoryManager.SaveAsync();
        }

        public async Task<IEnumerable<UserModel>> GetAllAsync()
        {
            var users = await _repositoryManager.Users.GetAllAsync();
            return users.ToList();
        }

        public async Task<UserDTO?> GetByIdAsync(int id)
        {
            var user=await _repositoryManager.Users.GetByIdAsync(id);
            var userDTO=_mapper.Map<UserDTO>(user);
            return userDTO;
        }

        public async Task<UserDTO> GetUserDetailsByIdAsync(int id)
        {
            var user = await _repositoryManager.Users.GetUserDetailsByIdAsync(id);
            var userDTO = _mapper.Map<UserDTO>(user);
            return userDTO;
        }

        public async Task<UserDTO> UpdateAsync(int id, UserDTO entity)
        {
            var user=await _repositoryManager.Users.UpdateAsync(id,_mapper.Map<UserModel>(entity));
            await _repositoryManager.SaveAsync();
            return _mapper.Map<UserDTO>(user);
        }

        public async Task UpdateUserCameOnAsync(int id, DateTime cameOn)
        {
            await _repositoryManager.Users.UpdateUserCameOnAsync(id,cameOn);
            await _repositoryManager.SaveAsync();
        }

        public async Task UpdateUserIsMedalAsync(int id, bool isMedal)
        {
            await _repositoryManager.Users.UpdateUserIsMedalAsync(id, isMedal);
            await _repositoryManager.SaveAsync();
        }

        public async Task UpdateUserLastPaintAsync(int id, DateTime? lastPaint)
        {
            await _repositoryManager.Users.UpdateUserLastPaintAsync(id, lastPaint);
            await _repositoryManager.SaveAsync();
        }

        public async Task UpdateUserNameAsync(int id, string name)
        {
            await _repositoryManager.Users.UpdateUserNameAsync(id, name);
            await _repositoryManager.SaveAsync();
        }
    }
}
