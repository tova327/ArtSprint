using AutoMapper;
using Server.Core.DTOs;
using Server.Core.models;

namespace Server.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserModel,UserDTO>().ReverseMap();
            CreateMap<CompetitionModel,CompetitionDTO>().ReverseMap();
            CreateMap<CompetitionPaintingDTO,CompetitionPaintingModel>().ReverseMap();
            CreateMap<CommentDTO,CommentModel>().ReverseMap();
            CreateMap<PaintingDTO,PaintingModel>().ReverseMap();
            CreateMap<CategoryDTO,CategoryModel>().ReverseMap();
		}
    }
}