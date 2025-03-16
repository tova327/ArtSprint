using AutoMapper;
using server.Post_Models;
using Server.Core.DTOs;

namespace server
{
    public class MappingPostProfile : Profile
    {
        public MappingPostProfile()
        {
            CreateMap<UserPostModel, UserDTO>();
            CreateMap<CommentPostModel, CommentDTO>();
            CreateMap<CompetitionPaintingPostModel, CompetitionPaintingDTO>();
            CreateMap<CompetitionPostModel, CompetitionDTO>();
            CreateMap<PaintingPostModel, PaintingDTO>();
        }
    }
}
