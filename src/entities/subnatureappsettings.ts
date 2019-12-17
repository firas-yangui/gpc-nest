import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {subnature} from "./subnature";
import {gpcappsettings} from "./gpcappsettings";


@Entity("subnatureappsettings" ,{schema:"public" } )
@Index("unique_subnature_gpcappsettings_couple",["gpcappsettings","model",],{unique:true})
export class subnatureappsettings {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>subnature, (subnature: subnature)=>subnature.subnatureappsettingss,{  })
    @JoinColumn({ name:'modelid'})
    model:subnature | null;


   
    @ManyToOne(()=>gpcappsettings, (gpcappsettings: gpcappsettings)=>gpcappsettings.subnatureappsettingss,{  })
    @JoinColumn({ name:'gpcappsettingsid'})
    gpcappsettings:gpcappsettings | null;


    @Column("character varying",{ 
        nullable:true,
        length:255,
        name:"dfincode"
        })
    dfincode:string | null;
        
}
