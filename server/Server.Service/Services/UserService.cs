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
            var existUser =await _repositoryManager.Users.GetUserByUsername(entity.Name);
            if (existUser != null) 
            {
                return null;
            }
            var userModel = _mapper.Map<UserModel>(entity);
            userModel.HashedPassword =BCrypt.Net.BCrypt.HashPassword(entity.Password); 
            var user=await _repositoryManager.Users.AddAsync(userModel);
            await _repositoryManager.SaveAsync();
            return _mapper.Map<UserDTO>(user);
        }

        public async Task DeleteAsync(int id)
        {
            await _repositoryManager.Users.DeleteAsync(id);
            await _repositoryManager.SaveAsync();
        }

        public async Task<IEnumerable<UserDTO>> GetAllAsync()
        {
            var users = await _repositoryManager.Users.GetAllAsync();
            var usersList=users.ToList();
            return _mapper.Map<List<UserDTO>>(usersList);
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
            // -----------------------------
            // GET EXISTING USER
            // -----------------------------
            var existingUser = await _repositoryManager.Users.GetByIdAsync(id);

            if (existingUser == null)
            {
                throw new Exception("User not found");
            }

            // -----------------------------
            // UPDATE ALLOWED FIELDS ONLY
            // -----------------------------
            existingUser.Name = entity.Name;
            existingUser.Email = entity.Email;
            existingUser.BirthDate = entity.BirthDate;

            // -----------------------------
            // UPDATE PASSWORD ONLY IF EXISTS
            // -----------------------------
            if (!string.IsNullOrWhiteSpace(entity.Password))
            {
                existingUser.HashedPassword =
                    BCrypt.Net.BCrypt.HashPassword(entity.Password);
            }

            // -----------------------------
            // SAVE
            // -----------------------------
            var updatedUser =
                await _repositoryManager.Users.UpdateAsync(id, existingUser);

            await _repositoryManager.SaveAsync();

            // -----------------------------
            // RETURN SAFE DTO
            // -----------------------------
            return _mapper.Map<UserDTO>(updatedUser);
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
        public async Task<UserDTO> GetUserByUsername(string username)
        {
            var user = await _repositoryManager.Users.GetUserByUsername(username);
            var userDto=_mapper.Map<UserDTO>(user);
            return userDto;
        }
    }
}
