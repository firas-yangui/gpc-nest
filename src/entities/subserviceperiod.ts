import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {period} from "./period";
import {subservice} from "./subservice";


@Entity("subserviceperiod" ,{schema:"public" } )
@Index("sub_service_period_unicity",["period","subservice",],{unique:true})
export class subserviceperiod {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("boolean",{ 
        nullable:true,
        default: () => "false",
        name:"isinvested"
        })
    isinvested:boolean | null;
        

   
    @ManyToOne(()=>period, (period: period)=>period.subserviceperiods,{  nullable:false, })
    @JoinColumn({ name:'periodid'})
    period:period | null;


   
    @ManyToOne(()=>subservice, (subservice: subservice)=>subservice.subserviceperiods,{  nullable:false, })
    @JoinColumn({ name:'subserviceid'})
    subservice:subservice | null;

}
