import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {subservice} from "./subservice";
import {subtypologyappsettings} from "./subtypologyappsettings";


@Entity("subtypology" ,{schema:"public" } )
@Index("uniquecode",["code",],{unique:true})
export class subtypology {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:3,
        name:"code"
        })
    code:string;
        

    @Column("text",{ 
        nullable:false,
        name:"name"
        })
    name:string;
        

    @Column("integer",{ 
        nullable:false,
        default: () => "0",
        name:"activitytype"
        })
    activitytype:number;
        

    @Column("text",{ 
        nullable:true,
        default: () => "'none'",
        name:"businesstype"
        })
    businesstype:string | null;
        

   
    @OneToMany(()=>subservice, (subservice: subservice)=>subservice.subtypology,{ onUpdate: 'CASCADE' })
    subservices:subservice[];
    

   
    @OneToMany(()=>subtypologyappsettings, (subtypologyappsettings: subtypologyappsettings)=>subtypologyappsettings.model)
    subtypologyappsettingss:subtypologyappsettings[];
    
}
