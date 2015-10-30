using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
  [DataContract(IsReference = true)]
  public class Survey
  {
    [Key]
    [DataMember]
    public virtual Guid SurveyId { get; set; }

    [DataMember]
    public virtual string Title { get; set; }

    [DataMember]
    public virtual string Description { get; set; }

    [DataMember]
    public virtual bool Fulfilled { get; set; }

    [DataMember]
    public virtual DateTime Date { get; set; }

    [DataMember]
    public virtual Guid? CompanySizeId { get; set; }

    [ForeignKey("CompanySizeId")]
    [DataMember]
    public virtual CompanySize CompanySize { get; set; }

    [DataMember]
    public virtual Guid? FiscalYearId { get; set; }

    [ForeignKey("FiscalYearId")]
    [DataMember]
    public virtual FiscalYear FiscalYear { get; set; }

    [DataMember]
    public virtual ICollection<Area> Areas { get; set; }

    [DataMember]
    public virtual ICollection<Product> Products { get; set; }

    [DataMember]
    public virtual ICollection<Reading> Readings { get; set; }

    [DataMember]
    public virtual ICollection<ProductionTime> ProductionTimes { get; set; }

    [DataMember]
    public virtual ICollection<Document> Documents { get; set; }

    [DataMember]
    public virtual ICollection<ImportantTopic> ImportantTopics { get; set; }

    [DataMember]
    public virtual Guid? OperationTimeId { get; set; }

    [ForeignKey("OperationTimeId")]
    [DataMember]
    public virtual OperationTime OperationTime { get; set; }

    [DataMember]
    public virtual Guid NetworkCompanyId { get; set; }

    [ForeignKey("NetworkCompanyId")]
    [DataMember]
    public virtual NetworkCompany NetworkCompany { get; set; }
  }
}