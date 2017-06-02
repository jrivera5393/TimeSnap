using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using TimeSnap.Models;

namespace TimeSnap.Migrations
{
    [DbContext(typeof(TimeSnapContext))]
    [Migration("20170602215918_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.0-rtm-22752");

            modelBuilder.Entity("TimeSnap.Models.Project", b =>
                {
                    b.Property<int>("ProjectId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Description");

                    b.Property<string>("Location");

                    b.Property<string>("Name");

                    b.Property<string>("Source");

                    b.HasKey("ProjectId");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("TimeSnap.Models.Task", b =>
                {
                    b.Property<long>("TaskId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("Description");

                    b.Property<long>("TimeEntryId");

                    b.Property<string>("Type");

                    b.HasKey("TaskId");

                    b.HasIndex("TimeEntryId");

                    b.ToTable("Tasks");
                });

            modelBuilder.Entity("TimeSnap.Models.TimeEntry", b =>
                {
                    b.Property<long>("TimeEntryId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("EndDate");

                    b.Property<int>("Hours");

                    b.Property<int>("Milliseconds");

                    b.Property<int>("Minutes");

                    b.Property<int>("ProjectId");

                    b.Property<int>("RunningTime");

                    b.Property<int>("Seconds");

                    b.Property<DateTime>("StartDate");

                    b.Property<string>("Status");

                    b.Property<string>("StorageId");

                    b.HasKey("TimeEntryId");

                    b.HasIndex("ProjectId");

                    b.ToTable("TimeEntries");
                });

            modelBuilder.Entity("TimeSnap.Models.Task", b =>
                {
                    b.HasOne("TimeSnap.Models.TimeEntry", "TimeEntry")
                        .WithMany()
                        .HasForeignKey("TimeEntryId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("TimeSnap.Models.TimeEntry", b =>
                {
                    b.HasOne("TimeSnap.Models.Project", "Project")
                        .WithMany("TimeEntries")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
