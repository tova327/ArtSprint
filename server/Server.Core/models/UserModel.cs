using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Server.Core.models
{
    

    public class UserModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        public DateTime CameOn { get; set; } = DateTime.Now;
        public string Email { get; set; }
        public string Password { get; set; }    
        [Required]
        [DataType(DataType.Date)]
        [CheckMinimumAge(18)]
        public DateTime BirthDate { get; set; }

        public bool IsMedal { get; set; } = false;

        public DateTime? LastPaint { get; set; }= DateTime.Now;

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
