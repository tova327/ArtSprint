using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Server.Core.models.CheckMinimumAgeAttribute;

namespace Server.Core.models
{
    

    public class UserModel : IHasTimestamps
	{
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }// V

        public DateTime CameOn { get; set; } = DateTime.Now;// V
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }
		public string Email { get; set; }// X
        public string HashedPassword { get; set; }    
        [Required]
        [DataType(DataType.Date)]
        [CheckMinimumAge(18)]
        public DateTime BirthDate { get; set; }// X

        public bool IsMedal { get; set; } = false;// V
        public string Role { get; set; } = "member";
        public DateTime? LastPaint { get; set; }= DateTime.Now;// V

        public ICollection<PaintingModel> Paintings { get; set; }
        public ICollection<CommentModel> Comments { get; set; }
        public ICollection<CompetitionModel> Competitions { get; set; }
    }

    public class CheckMinimumAgeAttribute : ValidationAttribute
    {
        private readonly int _minimumAge;

        public CheckMinimumAgeAttribute(int minimumAge)
        {
            _minimumAge = minimumAge;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var birthDate = (DateTime)value;
            if (birthDate.AddYears(_minimumAge) > DateTime.Now)
            {
                return new ValidationResult($"Age must be at least {_minimumAge} years.");
            }
            return ValidationResult.Success;
        }

        
    }
}
