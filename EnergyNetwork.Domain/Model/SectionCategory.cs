using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
    [DataContract(IsReference = true)]
    public class SectionCategory
    {
        [Key]
        [DataMember]
        public virtual Guid SectionCategoryId { get; set; }

        [DataMember]
        public virtual string Title { get; set; }

        [DataMember]
        public virtual string Description { get; set; }
    }
}