using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
  [DataContract(IsReference = true)]
  public class NetworkCompany
  {
    [Key]
    [DataMember]
    public virtual Guid NetworkCompanyId
    {
      get;
      set;
    }

   
    [DataMember]
    public virtual Guid NetworkId
    {
      get;
      set;
    }



    [ForeignKey("NetworkId")]
    [DataMember]
    public virtual Network Network
    {
      get;
      set;
    }

    [ForeignKey("CompanyId")]
    [DataMember]
    public virtual Company Company
    {
      get;
      set;
    }
     
    [DataMember]
    public virtual Guid CompanyId
    {
      get;
      set;
    }

    [DataMember]
    public virtual ICollection<Measure> Measures
    {
        get;
        set;
    }

    [DataMember]
    public virtual ICollection<Survey> Surveys
    {
      get;
      set;
    }
  }
}